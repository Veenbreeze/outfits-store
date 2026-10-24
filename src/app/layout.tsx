import type {Metadata} from 'next';import './globals.css';import {Header,Footer} from '../components';
export const metadata:Metadata={title:'Veenbreeze Fashion',description:'A considered wardrobe and an immersive virtual boutique.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body><Header/><main>{children}</main><Footer/></body></html>}
