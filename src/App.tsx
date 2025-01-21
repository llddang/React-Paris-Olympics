import MedalForm from "@/MedalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedalFormSubmitType } from "@/types.type";
import { MedalRecordDto } from "@/types.dto";

import { useLocalStorage } from "usehooks-ts";
import { toast } from "sonner";
import { MEDAL_TYPES } from "./constants/medal.constant";
import MedalTable from "./MedalTable";

function App() {
  const [medalList, setMedalList] = useLocalStorage<MedalRecordDto[]>(
    "medal-list",
    []
  );

  function handleSubmit(formData: MedalRecordDto, type: MedalFormSubmitType) {
    if (MedalFormSubmitConfig[type].isInvalidate(medalList, formData.country)) {
      toast.warning("잘못된 입력 방식입니다.", {
        description: MedalFormSubmitConfig[type].errorMessage,
      });
      return;
    }

    if (type === MedalFormSubmitType.ADD)
      setMedalList((prev) => [...prev, formData]);
    if (type === MedalFormSubmitType.UPDATE)
      setMedalList((prev) => [
        ...prev.filter((item) => item.country !== formData.country),
        formData,
      ]);
  }

  return (
    <Card className="min-w-[600px] max-w-[1000px] w-4/5 mx-auto mt-12">
      <CardHeader>
        <CardTitle>2024 파리 올림픽</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <MedalForm onSubmit={handleSubmit} />
        <MedalTable
          medalList={medalList.map((item) => ({
            ...item,
            total: MEDAL_TYPES.reduce((acc, value) => acc + item[value], 0),
          }))}
          setMedalList={setMedalList}
        />
      </CardContent>
    </Card>
  );
}

export default App;

const MedalFormSubmitConfig: {
  [key in MedalFormSubmitType]: {
    errorMessage: string;
    isInvalidate: (list: MedalRecordDto[], country: string) => boolean;
  };
} = {
  [MedalFormSubmitType.ADD]: {
    errorMessage: "이미 존재하는 국가입니다.",
    isInvalidate: (list, country) =>
      list.some((item) => item.country === country),
  },
  [MedalFormSubmitType.UPDATE]: {
    errorMessage: "기존에 존재하지 않은 국가입니다.",
    isInvalidate: (list, country) =>
      !list.some((item) => item.country === country),
  },
};
