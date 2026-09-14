import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  // Simulates successful upload in development
  return new NextResponse(null, { status: 200 });
}
