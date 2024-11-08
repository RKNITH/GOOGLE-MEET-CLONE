import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";



export async function middleware(req){
    const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET});

    //if user try to go /user-auth after login
    if(req.nextUrl.pathname === '/user-auth' && token){
        return NextResponse.redirect(new URL('/',req.url));
    }

    //if user try to acess home page without login
    if(!token && req.nextUrl.pathname !== '/user-auth'){
        return NextResponse.redirect(new URL('/user-auth',req.url));
    }

    return NextResponse.next();
}
export const config={
    matcher: ['/', '/user-auth']
}