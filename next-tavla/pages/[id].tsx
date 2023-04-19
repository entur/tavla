import { Board } from "@/components/Board";
import { Header } from "@/components/Header";
import { TSettings } from "@/types/settings";
import { getBoardSettings } from "@/utils/firebase";

export async function getServerSideProps({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const settings: TSettings | undefined = await getBoardSettings(id);

  if (!settings) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      settings,
    },
  };
}

function BoardPage({ settings }: { settings: TSettings }) {
  return (
    <div className="root" data-theme={settings.theme}>
      <div className="root-container">
        <Header />
        <Board settings={settings} />
      </div>
    </div>
  );
}

export default BoardPage;
