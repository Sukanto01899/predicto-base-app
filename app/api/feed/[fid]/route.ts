import neynarClient from "@/config/neynar";
import { FetchFeedFeedTypeEnum } from "@neynar/nodejs-sdk/build/api";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: Promise<{ fid: number }>;
};

export async function GET(request: NextRequest, { params }: Context) {
  const feedType = FetchFeedFeedTypeEnum.Following;
  const withRecasts = true;
  const limit = 50;
  const viewerFid = 6131;

  try {
    const { fid } = await params;
    const res = await neynarClient.fetchUserChannels({
      fid,
      limit,
    });
    console.log(res);

    return NextResponse.json({ message: "Success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Unknown error", error);
    }
    return NextResponse.json({ error: "Something wrong" });
  }
}
