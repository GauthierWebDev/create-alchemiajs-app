import { settings } from "@/config";
import server from "@/server";

server.listen(settings.PORT, () => {
  console.log(`Server listening on port ${settings.PORT}`);
});
