import { method, route } from "@/decorators";
import { Controller } from "@/libs";

class TempController extends Controller {
  @method("get")
  @route("/temp")
  public async index() {
    this.render("wip");
  }
}

export default TempController;
