import { method, route } from "@/decorators";
import { Controller } from "@/libs";

class TestController extends Controller {
  @method("get")
  @route("/test")
  public async index() {
    this.render("wip");
  }
}

export default TestController;
