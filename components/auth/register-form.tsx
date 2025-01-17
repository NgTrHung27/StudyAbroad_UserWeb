"use client";

import { register } from "@/actions/auth/register";
import { RegisterSchema } from "@/schemas";
import { SchoolData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Spinner, Tab, Tabs } from "@nextui-org/react";
import { CertificateType, DegreeType, Gender, GradeType } from "@prisma/client";
import { GraduationCap, NotepadText, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form } from "../ui/form";
import { CardWrapper } from "./card-wrapper";
import { AccountTab } from "./register/account-tab";
import { EducationTab } from "./register/education-tab";
import { ProfileTab } from "./register/profile-tab";

interface RegisterFormProps {
  schools: SchoolData;
}

export type RegisterFormType = z.infer<typeof RegisterSchema>;

export const RegisterForm = ({ schools }: RegisterFormProps) => {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Key>("account");

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      dob: new Date("2006-01-01"),
      gender: Gender.MALE,
      phoneNumber: "",
      idCardNumber: "",
      city: "",
      district: "",
      ward: "",
      addressLine: "",
      country: schools[0].country,
      schoolName: schools[0].name,
      programName: schools[0].programs[0].name,
      degreeType: DegreeType.HIGHSCHOOL,
      certificateType: CertificateType.IELTS,
      gradeType: GradeType.GPA,
      gradeScore: "1",
    },
  });

  const onSubmit = async (values: RegisterFormType) => {
    setIsLoading(true);

    await register(values)
      .then((res) => {
        if (res.success) {
          toast.success(res.success);
          setTimeout(() => router.push("/auth/login"), 3000);
        }

        if (res.error) {
          toast.error(res.error);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const onValidateSubmit = () => {
    if (form.formState.isSubmitting) return;
    if (!form.formState.isValid) {
      toast.error("Please enter correct information");
      return;
    }
  };

  form.watch("country");
  form.watch("schoolName");
  form.watch("certificateImg");
  form.watch("gradeType");
  form.watch("certificateType");
  form.watch("degreeType");

  const listSchools = schools.filter(
    (school) => school.country === form.getValues("country"),
  );

  const programs =
    schools.find((school) => school.name === form.getValues("schoolName"))
      ?.programs || [];

  useEffect(() => {
    setMounted(true);
    // Chỉ sử dụng khi testing
    const handleMouseClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | undefined;

      const button = el?.closest?.<HTMLButtonElement>(
        'button[data-slot="tab"]',
      );

      if (button) {
        const key = button?.dataset.key as Key;

        setSelectedTab(key);
      }
    };

    document.addEventListener("click", handleMouseClick);

    return () => document.removeEventListener("click", handleMouseClick);
  }, [mounted]);

  return (
    <CardWrapper
      headerLabel="Đăng ký hồ sơ"
      backButtonLabel="Đã có tài khoản? Đăng nhập ngay"
      backButtonHref="/auth/login"
      subLabel="Điền đầy đủ thông tin để tạo hồ sơ du học của bạn"
    >
      {!mounted ? (
        <Spinner label="Please wait while loading..." />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-[70vh] overflow-y-auto scrollbar-hide"
          >
            <div className="!flex flex-col items-center justify-center">
              <Tabs
                size="md"
                color="primary"
                variant="bordered"
                aria-label="Options"
                className="flex-1"
                selectedKey={selectedTab.toString()}
                classNames={{
                  cursor: "bg-[#7D1f1F]",
                  tabList: "mb-3",
                  tabContent: "group-data-[selected=true]:dark:text-primary",
                }}
              >
                {/* Account */}
                <Tab
                  key="account"
                  title={
                    <div className="flex items-center space-x-2">
                      <User className="size-4" />
                      <span>Account</span>
                    </div>
                  }
                  className="w-full"
                >
                  <AccountTab control={form.control} isLoading={isLoading} />
                </Tab>
                {/* Profile */}
                <Tab
                  key="profile"
                  title={
                    <div className="flex items-center space-x-2">
                      <NotepadText className="size-4" />
                      <span>Profile</span>
                    </div>
                  }
                  className="w-full"
                >
                  <ProfileTab
                    city={form.getValues("city")}
                    control={form.control}
                    district={form.getValues("district")}
                    isLoading={isLoading}
                  />
                </Tab>
                {/* Education */}
                <Tab
                  key="education"
                  title={
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="size-4" />
                      <span>Education</span>
                    </div>
                  }
                  className="w-full"
                >
                  <EducationTab
                    control={form.control}
                    ctfImg={form.getValues("certificateImg")}
                    ctfType={form.getValues("certificateType")}
                    gradeType={form.getValues("gradeType")}
                    isLoading={isLoading}
                    onFileChange={(e) => form.setValue("certificateImg", e)}
                    programs={programs}
                    schoolName={form.getValues("schoolName")}
                    schools={listSchools}
                  />
                </Tab>
              </Tabs>
              <Button
                onClick={onValidateSubmit}
                isLoading={isLoading}
                isDisabled={isLoading}
                type="submit"
                className="mt-4 w-full bg-[#7D1F1F] font-semibold text-white"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
