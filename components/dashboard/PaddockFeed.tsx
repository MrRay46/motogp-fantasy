import PaddockPost from "./PaddockPost";

export default function PaddockFeed(){

return(

<div className="bg-zinc-900 rounded-3xl p-8">

<h2 className="text-2xl font-bold mb-6">

🏍 PADDOCK

</h2>

<PaddockPost

tipo="🔴 LESIÓN"

titulo="Jorge Martín será baja este GP."

hora="Hace 1 h"

/>

<PaddockPost

tipo="🟠 RUMOR"

titulo="Pedro Acosta podría cambiar de fabricante."

hora="Hace 3 h"

/>

<PaddockPost

tipo="🔵 OFICIAL"

titulo="Ducati confirma evolución del motor."

hora="Hace 5 h"

/>

</div>

);

}