import { Padding } from "@mui/icons-material";
import { Recipes } from "../components/recipes";

export const Home = () => {
  return (
    <div>
      <Recipes title={"home"} />
      <Recipes title={"featured"} />
    </div>
  );
};
