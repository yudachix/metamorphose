import App from "@/components/app";
import { defaultTitle } from "@/utils/consts";

export const metadata = {
  title: defaultTitle,
  description: "ことわざ・慣用句、作品名などの一部を別の単語に置き換えるウェブアプリです。"
};

export default function Page() {
  return <App />;
}
