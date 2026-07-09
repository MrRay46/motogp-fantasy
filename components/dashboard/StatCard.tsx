import DashboardCard from "./DashboardCard";

type Props={

titulo:string;

valor:string;

estado?:"good"|"neutral"|"bad";

};

export default function StatCard({

titulo,

valor,

estado="neutral",

}:Props){

const colores={

good:"border-green-500/30 shadow-green-500/10",

neutral:"",

bad:"border-red-500/30 shadow-red-500/10",

};

return(

<DashboardCard

className={`
shadow-lg
${colores[estado]}
`}

>

<p className="text-zinc-400">

{titulo}

</p>

<h2 className="text-4xl font-black mt-3">

{valor}

</h2>

</DashboardCard>

);

}