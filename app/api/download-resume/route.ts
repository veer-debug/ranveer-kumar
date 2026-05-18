import { NextResponse } from "next/server"

const DRIVE_FILE_ID = "1OOO6zi8kWjvAuuSPpozG4crjfaXY-Yhi"

export async function GET() {
  try {
    // Use drive's direct download endpoint
    const driveUrl = `https://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`
    const res = await fetch(driveUrl)

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch resume from Drive" }, { status: 502 })
    }

    const contentType = res.headers.get("content-type") || "application/pdf"

    // Stream the response body back to the client with an attachment header
    const headers = new Headers()
    headers.set("Content-Type", contentType)
    headers.set("Content-Disposition", `attachment; filename=Ranveer_Kumar_Resume.pdf`)

    return new NextResponse(res.body, { headers })
  } catch (err) {
    return NextResponse.json({ error: "Server error fetching resume" }, { status: 500 })
  }
}
