import { NextResponse } from "next/server";
import { type ContactRequest, readContactForm, validateContact } from "@/lib/contact";
import { sendContactEmail } from "@/lib/email";
import { CONTACT } from "@/lib/site";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Contact API is operational. Submit contact inquiries via POST.",
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: ContactRequest;

    if (contentType.includes("application/json")) {
      const json = await request.json();

      const rawServices = json.services;
      const services = Array.isArray(rawServices)
        ? rawServices.map(String).filter(Boolean)
        : typeof rawServices === "string" && rawServices.trim()
        ? [rawServices.trim()]
        : [];

      data = {
        services,
        propertyType: String(json.propertyType || "Residential"),
        timeline: String(json.timeline || ""),
        firstName: String(json.firstName || ""),
        lastName: String(json.lastName || ""),
        phone: String(json.phone || ""),
        email: String(json.email || ""),
        contactMethod: String(json.contactMethod || "Call"),
        message: String(json.message || ""),
        bedrooms: json.bedrooms ? String(json.bedrooms) : undefined,
        bathrooms: json.bathrooms ? String(json.bathrooms) : undefined,
        county: json.county ? String(json.county) : undefined,
      };
    } else {
      const formData = await request.formData();
      data = readContactForm(formData);
    }

    // Validate the parsed contact data
    const errors = validateContact(data);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: "Please check the highlighted fields.",
        },
        { status: 400 }
      );
    }

    // Send the contact email using the reusable lib
    const result = await sendContactEmail(data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.error ||
            `Something went wrong sending your request. Please try again or call ${CONTACT.phoneDisplay}.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your request has been received.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API /api/contact error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `An unexpected error occurred. Please try again or call ${CONTACT.phoneDisplay}.`,
      },
      { status: 500 }
    );
  }
}
