import { Board } from "@/components/Board";
import { useRouter } from "next/router";

function Tavle() {
  const router = useRouter();

  const { id } = router.query;
  if (!id || typeof id !== "string") {
    return null;
  }
  return (
    <div className="root">
      <div className="root-container">
        <Board id={id} />
      </div>
    </div>
  );
}

export default Tavle;
