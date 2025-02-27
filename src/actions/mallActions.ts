import { useStore } from "@/store/store";
const {setMall}= useStore();

const dummyAction = () =>{
    setMall("dummy");

}