$fa = 1;
$fs = 1;

material = "PLA";
brand = "Fillamentum";
name = "Traffic Yellow";
size = 6;

difference(){roundedcube(60,40,2,5);
    union(){
        trianglecutout(12,12,10,3,2);
        createtext(material, brand, name, size);
    }}
    
module createtext(material,manufacturer,name,textsize){
    translate([0,0,1.6])
   linear_extrude(height=1, center = false, convexity = 10, twist = 0, slices = 20, scale=1.0 ){    
   rotate([0,0,180]){
    translate([-55,-20,1.8]){
        text(material,size = textsize , font = "Liberation Sans:style=Bold");
            translate([0, (-(textsize+2))]) {
                text(manufacturer,size = (textsize-1) , font = "Liberation Sans:style=Bold");
 }
            translate([0, (-2*(textsize+2))]) {
                text(name,size = (textsize-1) , font = "Liberation Sans:style=Bold");
 }
 }
 }
 }
}

module roundedcube(xdim ,ydim ,zdim,rdim){
hull(){
translate([rdim,rdim,0])cylinder(h=zdim,r=rdim);
translate([xdim-rdim,rdim,0])cylinder(h=zdim,r=rdim);

translate([rdim,ydim-rdim,0])cylinder(h=zdim,r=rdim);
translate([xdim-rdim,ydim-rdim,0])cylinder(h=zdim,r=rdim);
}
}

module trianglecutout(xdim ,ydim ,zdim ,rdim,thickness){
    translate([thickness,thickness,-thickness]){
hull(){
translate([rdim,rdim,0])cylinder(h=zdim,r=rdim);
translate([xdim-rdim,rdim,0])cylinder(h=zdim,r=rdim);

translate([rdim,ydim-rdim,0])cylinder(h=zdim,r=rdim);
//translate([xdim-rdim,ydim-rdim,0])cylinder(h=zdim,r=rdim);
}
}
}

