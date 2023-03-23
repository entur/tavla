import { Tile } from "@/components/Tile";
import { useRouter } from "next/router";

function Tavle() {
  const router = useRouter();

  const { id } = router.query;
  return (
    <div className="root">
      <div className="root-container">
        <Tile id="NSR:StopPlace:337" />
      </div>
    </div>
  );
}

export default Tavle;
