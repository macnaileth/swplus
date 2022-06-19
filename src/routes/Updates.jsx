//internal ressources and compomnents
import MessageRoll from '../components/MessageRoll.jsx';

//JSON containing update messages
import Messages from "../data/json/sw-updates-data.json";

export default function Updates() {
  return (
    <div className="py-3">
      <h1 className="display-6 text-secondary">Updates</h1>
      <MessageRoll 
        data = { Messages }
        SpacingY = "3"
      />
    </div>
  );
}
