import { TileContainer } from "@/components/TileContainer";
import { useRouter } from "next/router";

function Tavle() {
  const router = useRouter();

  const { id } = router.query;
  return <TileContainer id={id} />;
}

export default Tavle;
