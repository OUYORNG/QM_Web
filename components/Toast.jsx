import { Button } from "@heroui/button";
import {addToast} from "@heroui/toast";
export default function Toast() {
  return (
    <div className="flex flex-wrap gap-2">
      {[ "Success"].map((color) => (
        <Button
          key={color}
          color={color.toLowerCase()}
          variant={"flat"}
          onPress={() =>
            addToast({
              title: "Toast title",
              description: "Toast displayed successfully",
              color: color.toLowerCase(),
            })
          }
        >
          {color}
        </Button>
      ))}
    </div>
  );
}
