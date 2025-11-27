// import { Card, CardContent } from "@/components/ui/card";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default function SessionDetailPage() {
//   // placeholder data
//   const session = {
//     id: 1,
//     user: "Paul Mossmann",
//     arrival: "28 août 2025 08:03",
//     departure: "28 août 2025 09:15",
//     duration: "72 minutes",
//     punches: [
//       { time: "08:03", type: "Arrivée" },
//       { time: "09:15", type: "Départ" }
//     ]
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Header */}
//       <div className="flex items-center bg-blue-600 text-white p-4 shadow">
//         <Link href="/admin/sessions" className="mr-4">
//           <ArrowLeft className="w-6 h-6" />
//         </Link>
//         <h1 className="text-xl font-semibold">Session #{session.id}</h1>
//       </div>

//       {/* Content */}
//       <div className="p-4 space-y-4">
//         {/* User Info */}
//         <Card className="border-blue-600">
//           <CardContent className="p-4 space-y-2">
//             <p className="text-sm text-gray-500">Utilisateur</p>
//             <p className="text-lg font-semibold text-gray-800">{session.user}</p>

//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <p className="text-sm text-gray-500">Arrivée</p>
//                 <p className="font-medium">{session.arrival}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Départ</p>
//                 <p className="font-medium">{session.departure}</p>
//               </div>
//             </div>

//             <div className="mt-4">
//               <p className="text-sm text-gray-500">Durée totale</p>
//               <p className="text-lg font-bold">{session.duration}</p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Timeline */}
//         <Card className="border-blue-600">
//           <CardContent className="p-4 space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">Timeline</h2>

//             <div className="relative border-l-2 border-blue-600 ml-3 space-y-6">
//               {session.punches.map((p, index) => (
//                 <div key={index} className="ml-4 relative">
//                   <div className="absolute -left-4 top-1 bg-blue-600 w-3 h-3 rounded-full"></div>
//                   <p className="text-sm font-semibold">{p.time}</p>
//                   <p className="text-gray-600">{p.type}</p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
