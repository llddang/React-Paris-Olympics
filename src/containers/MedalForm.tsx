import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

import { MEDAL_LABELS, MEDAL_TYPES } from "@/constants/medal.constant";
import { PARIS_OLYMPICS_COUNTRIES_OPTION } from "@/constants/country.constant";
import { MedalRecordDto } from "@/types.dto";
import { MedalFormSubmitType } from "@/types.type";

export interface MedalFormProps {
  onSubmit: (data: MedalRecordDto, type: MedalFormSubmitType) => void;
}

export default function MedalForm({ onSubmit }: MedalFormProps) {
  const [formData, setFormData] = useState<MedalRecordDto>(initialFormData);

  function handleCountryChange(newCountry: string) {
    setFormData((prev) => ({
      ...prev,
      country: newCountry,
    }));
  }

  function handleMedalCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isInvalidateMedalFormData(formData)) {
      toast.warning("잘못된 입력 형식입니다.", {
        description: "국가가 선택되었고 메달의 값이 0 이상인지 확인해 주세요.",
      });
      return;
    }

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const action = submitter.formAction.split("/").at(-1);

    onSubmit(formData, action as MedalFormSubmitType);
    setFormData(initialFormData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-4 mb-2 text-center">
        <div className="flex-1">
          <p className="font-medium">국가명</p>
          <Combobox
            options={PARIS_OLYMPICS_COUNTRIES_OPTION}
            value={formData.country}
            onChange={handleCountryChange}
            defaultValue="국가 선택"
          />
        </div>
        {MEDAL_TYPES.map((type) => (
          <div key={type} className="flex-1">
            <p className="font-medium">{MEDAL_LABELS[type]}</p>
            <Input
              type="number"
              id={type}
              value={formData[type]}
              onChange={handleMedalCountChange}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row-reverse gap-4">
        <Button
          variant="outline"
          type="submit"
          formAction={MedalFormSubmitType.UPDATE.toString()}
        >
          갱신하기
        </Button>
        <Button type="submit" formAction={MedalFormSubmitType.ADD.toString()}>
          추가하기
        </Button>
      </div>
    </form>
  );
}

const initialFormData: MedalRecordDto = {
  country: "",
  gold: 0,
  sliver: 0,
  bronze: 0,
};

function isInvalidateMedalFormData(formData: MedalRecordDto) {
  if (formData.country === "") return true;
  if (formData.gold < 0 || formData.sliver < 0 || formData.bronze < 0)
    return true;
  return false;
}