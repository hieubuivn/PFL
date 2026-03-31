import { Lensflare, LensflareElement } from '../utils/lensflare.js';
import { resources } from '../resources/loadResources.js';
import * as THREE from 'three';

export function addLensflare(attachTo, color) {
    const lensflare = new Lensflare();
    lensflare.name = 'lensflare';

    lensflare.fader = (opacity, index = 0) => {
        if (lensflare.elements && lensflare.elements[index]) {
            lensflare.elements[index].opacity = opacity;
        }
    };

    // lensflare.position.set(-3, -10, 7)
    const textureFlare0 = resources.lensFlare0;
    const textureFlare3 = resources.lensFlare3;

    lensflare.addElement(new LensflareElement(textureFlare0, 500, 0, color));
    // lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    // lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    // lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    // lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));

    lensflare.setSize = (size, index = 0) => {
        if (lensflare.elements && lensflare.elements[index]) {
            lensflare.elements[index].size = size;
        }
    };

    if (attachTo) {
        attachTo.add(lensflare);
    }
    attachTo.lensFlare0 = lensflare
    return lensflare;
}
