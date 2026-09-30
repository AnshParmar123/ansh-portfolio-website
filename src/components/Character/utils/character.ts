import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const isMesh = (object: THREE.Object3D): object is THREE.Mesh => {
  return object instanceof THREE.Mesh;
};

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async () => {
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      return new Promise<GLTF | null>((resolve, reject) => {
        loader.load(
          blobUrl,
          async (gltf) => {
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child) => {
              if (isMesh(child)) {
                const mesh = child;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            const rightFoot = character.getObjectByName("footR");
            const leftFoot = character.getObjectByName("footL");
            if (rightFoot) rightFoot.position.y = 3.36;
            if (leftFoot) leftFoot.position.y = 3.36;
            dracoLoader.dispose();
            URL.revokeObjectURL(blobUrl);
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            URL.revokeObjectURL(blobUrl);
            reject(error);
          }
        );
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
