import { useParams } from "react-router-dom";

export const ProfilePage = () => {
  let { userId } = useParams();
  return (
    <div>
      <h1>{userId}</h1>
    </div>
  );
};
