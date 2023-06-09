# Filament swatch
I needed a simple system for creating samples of my many rolls of 3D printer filament.
I also wanted an easy way to run the generator, so I quickly slapped together this monstrosity.

It works in a way similar to Thingiverse's generator which can transform an OpenSCAD file
together with its parameters, generating an .stl file.

## How to run the damn thing
To run this image, simply issue the following command in your terminal of choice:

```bash
docker run -d -p 3000:3000 ~/swatches:/app/out manisto/openscad-generator
```