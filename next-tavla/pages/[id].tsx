import { Board } from "@/components/Board";
import { firebase, TSettings } from "@/types/settings";

export async function getServerSideProps({ params }) {
  const { id }: { id: string } = params;

  const settings: TSettings | undefined = firebase[id];

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
