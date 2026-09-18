import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MiembroResponse } from "../../types/members.types";
import frontCard from "@/assets/DELANTE_CARNET.jpeg";
import backCard from "@/assets/REVERSO_CARNET.jpeg";
import { PrinterIcon } from "lucide-react";
import { getMemberPhotoUrl } from "@/lib/supabase";

interface PrintCardsProps {
  members: MiembroResponse[];
}

const PrintCards = ({ members }: PrintCardsProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div>
      <Button
        onClick={reactToPrintFn}
        disabled={members.length === 0}
        variant="pdf"
      >
        Imprimir Carnets <PrinterIcon />
      </Button>
      <div ref={contentRef} className="sr-only print:not-sr-only p-10">
        {members.map((member) => (
          <div className="flex gap-1" key={member.id}>
            <div className="break-inside-avoid mb-4">
              <div
                className="relative w-[85.60mm] h-[53.98mm]  mb-4 bg-cover"
                style={{ backgroundImage: `url(${frontCard})` }}
              >
                <p className="absolute top-[26.5mm] left-[6mm] text-sm font-medium text-black">
                  {member.apellidos}
                </p>
                <p className="absolute top-[37mm] left-[6mm] text-sm font-medium text-black">
                  {member.nombres}
                </p>
                <p className="absolute top-[46mm] left-[4mm] text-sm font-medium text-black">
                  {member.dni}
                </p>
                <p className="absolute top-[46mm] left-[30mm] text-sm font-medium text-black">
                  {member.codigo}{" "}
                </p>
                <p className="absolute top-[47mm] left-[60mm] text-xs font-medium text-black">
                  {/*Fecha de caducidad (ultimo dia del año actual)*/}
                  31-12-{new Date().getFullYear()}
                </p>
                {member.foto_url && (
                  <img
                    src={getMemberPhotoUrl(member.foto_url)}
                    alt=""
                    className="absolute top-[20mm] left-[60mm] h-[25mm] w-[20mm]"
                  />
                )}
              </div>
            </div>
            <div className="break-inside-avoid mb-4">
              <div
                className="relative w-[85.60mm] h-[53.98mm]  mb-4 bg-cover"
                style={{ backgroundImage: `url(${backCard})` }}
              >
                <p className="absolute top-[26.5mm] left-[6mm] text-sm font-medium text-black">
                  {member.tipo_miembro_id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PrintCards;
