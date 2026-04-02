
/**
 * Helper function to inspect an object hierarchy and print out bone names.
 * Use this to identify the correct Root Bone name for physics binding.
 * 
 * @param {THREE.Object3D} object - The object to inspect (e.g., your character model group).
 */
export function debugBoneHierarchy(object) {
    console.group(`🔍 Inspecting Hierarchy for: "${object.name}"`);

    const bones = [];
    const meshes = [];

    object.traverse((child) => {
        if (child.isBone) {
            bones.push({
                name: child.name,
                type: 'Bone',
                parent: child.parent ? child.parent.name : 'null'
            });
        }
        if (child.isSkinnedMesh) {
            meshes.push(child.name);
        }
    });

    console.log(`🦴 Found ${bones.length} Bones:`);
    if (bones.length > 0) {
        console.table(bones);
    } else {
        console.warn("⚠️ No bones found! Is this a loaded GLB/GLTF?");
    }

    console.log(`👕 Found ${meshes.length} SkinnedMeshes:`, meshes);
    console.groupEnd();
}
