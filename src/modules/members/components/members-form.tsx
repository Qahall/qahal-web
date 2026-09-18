import { UITabs } from "@/components/tabs";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import PersonalData from "./tabs/personal-data";
import ContactData from "./tabs/contact-data";
import EclesiasticData from "./tabs/eclesiastic-data";
import CoursesChargesData from "./tabs/courses-charges-data";
import { memberSchema, MemberSchemaType } from "../schemas/member-schema";
import { mapFormToMemberCreate } from "../helpers/create-member-mapper";
import { useMemberById } from "../hooks/useMembersGet";
import { mapMiembroResponseToForm } from "../helpers/get-member-mapper";
import { MEMBER_PHOTOS_BUCKET, supabase } from "@/lib/supabase";
import { useCreateMember } from "../hooks/useMembersCreate";
import { useUpdateMember } from "../hooks/useMembersUpdate";
import { toast } from "sonner";

interface MembersFormProps {
  mode?: "create" | "edit";
  id?: number;
  setOpen: (b: boolean) => void;
}

const MembersForm = ({ mode, id, setOpen }: MembersFormProps) => {
  const form = useForm<MemberSchemaType>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      dni: "",
      nombres: "",
      apellidos: "",
      estado_civil: "soltero",
      sexo: "M",
      tiene_hijos: "no",
      fecha_conversion: null,
    },
  });

  const { mutateAsync: createMemberFn, isPending: isPendingCreateMember } =
    useCreateMember();
  const { mutateAsync: updateMemberFn, isPending: isPendingUpdateMember } =
    useUpdateMember();
  const { data: member, isLoading } = useMemberById(id);
  const { handleSubmit, formState, reset } = form;
  const [currentTab, setCurrentTab] = useState("step1");
  const [loadingFoto, setLoadingFoto] = useState(false);
  useEffect(() => {
    if (mode === "edit" && member) {
      reset(mapMiembroResponseToForm(member));
    }
  }, [mode, member, reset]);

  const goToFirstErrorTab = (errors: typeof formState.errors) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;

    // Mapping of fields to tabs
    // Step 1: Datos personales
    // Step 2: Contacto y nacimiento
    // Step 3: Datos Eclesiásticos
    // Step 4: Cursos y cargos

    // Check for errors in step 1 fields
    const step1Fields = [
      "dni",
      "nombres",
      "apellidos",
      "foto",
      "estado_civil",
      "sexo",
      "tiene_hijos",
      "tipo_miembro_id",
      "grado_instruccion",
      "profesion",
      "ocupacion_actual",
    ];
    if (step1Fields.some((field) => errorKeys.includes(field))) {
      setCurrentTab("step1");
      return;
    }

    // Check for errors in step 2 fields
    const step2Fields = [
      "celular",
      "email",
      "zona",
      "direccion",
      "fecha_nacimiento",
      "pais",
      "ciudad",
      "provincia",
      "distrito",
    ];
    if (step2Fields.some((field) => errorKeys.includes(field))) {
      setCurrentTab("step2");
      return;
    }

    // Check for errors in step 3 fields
    const step3Fields = [
      "fecha_conversion",
      "iglesia_conversion",
      "lugar_conversion",
      "fecha_bautismo_espiritu",
      "iglesia_bautismo_espiritu",
      "lugar_bautismo_espiritu",
      "fecha_transferencia",
      "iglesia_transferencia",
      "lugar_transferencia",
      "fecha_bautizo",
      "lugar_bautizo",
      "iglesia_bautizo",
    ];
    if (step3Fields.some((field) => errorKeys.includes(field))) {
      setCurrentTab("step3");
      return;
    }

    // Check for errors in step 4 fields (arrays)
    const step4Fields = ["cursos", "cargos", "ministerios"];
    if (step4Fields.some((field) => errorKeys.includes(field))) {
      setCurrentTab("step4");
      return;
    }
  };

  const onSubmit = async (formData: MemberSchemaType) => {
    //INTENTA SUBIR FOTO ANTES DE GUARDAR

    const isEdit = mode === "edit";
    const previousFoto = member?.foto_url ?? null;

    let newFotoPath: string | null = null; // foto recién subida
    let fotoToSend: string | null = previousFoto; // valor final que irá al backend

    try {
      setLoadingFoto(true);
      // 1. MANEJO DE NUEVA FOTO SUBIDA
      if (formData.foto instanceof File) {
        // SUBIR NUEVA FOTO
        const file = formData.foto;
        const uniqueName = `public/${crypto.randomUUID()}-${file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(MEMBER_PHOTOS_BUCKET)
          .upload(uniqueName, file);

        if (uploadError) {
          throw new Error("No se pudo subir la foto. Guardado cancelado.");
        }

        newFotoPath = uploadData.path;
        fotoToSend = newFotoPath;

        // Si está en edición: eliminar foto anterior
        if (isEdit && previousFoto) {
          await supabase.storage
            .from(MEMBER_PHOTOS_BUCKET)
            .remove([previousFoto]);
        }
      }
      // 2. MANEJO DE ELIMINAR FOTO (en edición)
      if (!formData.foto && isEdit && previousFoto) {
        // El usuario eliminó la imagen
        const { error: deleteError } = await supabase.storage
          .from(MEMBER_PHOTOS_BUCKET)
          .remove([previousFoto]);

        if (deleteError) {
          console.warn("No se pudo eliminar la foto anterior", deleteError);
        }

        fotoToSend = null;
      }
      // 3. GUARDAR EN BACKEND
      const dataToSend = mapFormToMemberCreate({
        ...formData,
        foto: fotoToSend,
      });

      if (isEdit) {
        await updateMemberFn({
          id: id!,
          data: dataToSend,
        });
        toast.success("Miembro actualizado correctamente. ");
      } else {
        await createMemberFn(dataToSend);
        toast.success("Miembro creado correctamente.");
      }

      // FIN DEL TRY — éxito total

      setOpen(false);
    } catch (err) {
      // 4. ROLLBACK — si ocurrió error después de subir una foto nueva

      if (newFotoPath) {
        console.warn("Eliminando foto recién subida por error…");
        await supabase.storage
          .from(MEMBER_PHOTOS_BUCKET)
          .remove([newFotoPath]);
      }
      toast.error(
        err instanceof Error
          ? err.message
          : "Error al crear o actualizar miembro"
      );
    } finally {
      setLoadingFoto(false);
    }
  };

  if (isLoading) {
    return <div>Cargando ...</div>;
  }
  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, goToFirstErrorTab)}
        className="space-y-6"
      >
        <UITabs
          tabs={[
            {
              value: "step1",
              label: "Datos personales",
              content: <PersonalData />,
            },
            {
              value: "step2",
              label: "Contacto y nacimiento",
              content: <ContactData />,
            },
            {
              value: "step3",
              label: "Datos Eclesiásticos",
              content: <EclesiasticData />,
            },
            {
              value: "step4",
              label: "Cursos y cargos",
              content: <CoursesChargesData control={form.control} />,
            },
          ]}
          defaultValue="step1"
          value={currentTab}
          onChange={(value) => setCurrentTab(value)}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isPendingCreateMember || isPendingUpdateMember || loadingFoto
            }
          >
            {isPendingCreateMember || isPendingUpdateMember || loadingFoto
              ? "Guardando... "
              : "Guardar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MembersForm;
