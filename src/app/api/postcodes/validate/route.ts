import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isValidUkPostcodeFormat, normalisePostcode } from "@/lib/postcodes";

const schema = z.object({ postcode: z.string().min(5).max(10) });

export async function POST(request: Request) {
  try {
    const { postcode } = schema.parse(await request.json());
    if (!isValidUkPostcodeFormat(postcode)) {
      return NextResponse.json({ valid: false, message: "Please enter a valid UK postcode." });
    }

    const normalised = normalisePostcode(postcode);
    const allowed = await prisma.allowedPostcode.findUnique({
      where: { postcode: normalised },
    });

    if (!allowed) {
      return NextResponse.json({
        valid: false,
        message:
          "Sorry, we only deliver locally around Dunstable. This postcode is outside our delivery area.",
      });
    }

    return NextResponse.json({ valid: true, area: allowed.area });
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request." }, { status: 400 });
  }
}
