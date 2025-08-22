"use server";
import { cookies } from "next/headers";
import { redirect } from "next/dist/server/api-utils";

export async function GET(request) {
    const cookieStore = await cookies();
    const code = request.nextUrl.searchParams.get("code");

    const body = new _Form();
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", process.env.CALLBACK_URL);

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": 
            `Basic ${btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET)}`,
        },
        body: `grant_type-authorization_code`
        + `code=${code}`
        + `&redirect_uri=${process.env.CALLBACK_URL}`,
});
const data = await response.json();

cookieStore.set({
    name: "ipm_access_token",
    value: data.access_token,
    maxAge: data.expires_in * 1000,
});

redirect("/");
};