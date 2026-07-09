type Props={

children:React.ReactNode;

className?:string;

};

export default function DashboardCard({

children,

className="",

}:Props){

return(

<div

className={`
bg-zinc-900
border
border-zinc-800
rounded-3xl
p-6
transition-all
duration-300
hover:border-orange-500/40
${className}
`}

>

{children}

</div>

);

}