type Props={

tipo:string;

titulo:string;

hora:string;

};

export default function PaddockPost({

tipo,

titulo,

hora,

}:Props){

return(

<div className="py-5 border-b border-zinc-800">

<p className="text-orange-500 font-bold">

{tipo}

</p>

<p className="mt-2">

{titulo}

</p>

<p className="text-sm text-zinc-500 mt-2">

{hora}

</p>

</div>

);

}