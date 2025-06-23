import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createSessionSchema = z.object({
  name: z.string().min(1).max(100),
  groupId: z.string().optional(),
  venueName: z.string().max(100).optional(),
  venueAddress: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        ...(status && { status }),
      },
      include: {
        group: {
          select: { id: true, name: true },
        },
        drinks: {
          select: { id: true, name: true, price: true, consumedAt: true },
        },
        _count: {
          select: { drinks: true },
        },
      },
      orderBy: { startTime: "desc" },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Get sessions error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    // Check if user has an active session
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
    })

    if (activeSession) {
      return NextResponse.json({ error: "You already have an active session" }, { status: 400 })
    }

    const newSession = await prisma.session.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        startTime: new Date(),
      },
      include: {
        group: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        session: newSession,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }

    console.error("Create session error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
