export type Product = {id:string;name:string;slug:string;description:string;category:string;price:number;salePrice?:number;sizes:string[];colors:{name:string;hex:string}[];stock:number;image:string;featured?:boolean;newArrival?:boolean;modelUrl?:string};
export type CartLine = {productId:string;size:string;color:string;quantity:number};
