import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Data = {
  name: any;
};

function Tavle({ name }: Data) {
  const router = useRouter();

  const { id } = router.query;

  const [newId, setNewId] = useState(Number(id));
  const [text, setText] = useState<any>();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNewId((d) => d + 1);
      fetch("https://fakerapi.it/api/v1/texts?_quantity=1").then(async (res) =>
        setText(await res.json())
      );
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <div>
        {newId}
        {text?.data[0].author ?? ''}
      </div>
      {name}
    </div>
  );
}

export async function getServerSideProps(): Promise<{ props: Data }> {
  return fetch("https://baconipsum.com/api/?type=meat-and-filler")
    .then((res) => {
      console.log(res.body);
      return res.json();
    })
    .then((data) => ({ props: { name: data } }));
}

export default Tavle;
