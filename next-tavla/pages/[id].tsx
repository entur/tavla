import { Board } from "@/components/Board";
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

function Tavle({ settings }: { settings: TSettings }) {
  return (
    <div className="root">
      <div className="root-container">
        <Board settings={settings} />
      </div>
    </div>
  );
}

export default Tavle;
