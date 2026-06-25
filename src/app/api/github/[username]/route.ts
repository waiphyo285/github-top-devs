import { NextResponse } from "next/server";
import { fetchGitHubData } from "@/lib/github";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const routeParams = await params;
    const username = routeParams.username;

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 },
      );
    }

    const data = await fetchGitHubData(username);

    if (!data) {
      return NextResponse.json(
        { error: `User '${username}' not found on GitHub` },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
