import json, math

topo = json.load(open("world.json"))
SC, TR = topo["transform"]["scale"], topo["transform"]["translate"]

def decode(arc):
    x = y = 0; out = []
    for dx, dy in arc:
        x += dx; y += dy
        out.append((x * SC[0] + TR[0], y * SC[1] + TR[1]))
    return out

ARCS = [decode(a) for a in topo["arcs"]]

def ring(idxs):
    pts = []
    for i in idxs:
        a = ARCS[i] if i >= 0 else ARCS[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts

def rings_of(geom):
    t = geom["type"]
    if t == "Polygon":  return [ring(r) for r in geom["arcs"]]
    if t == "MultiPolygon": return [ring(r) for poly in geom["arcs"] for r in poly]
    return []

# ---- d3.geoMercator().fitExtent(...) reimplemented exactly ----
def merc(lon, lat, k, tx, ty):
    lam = math.radians(lon)
    phi = math.radians(max(min(lat, 89.9999), -89.9999))
    y = math.log(math.tan(math.pi / 4 + phi / 2))
    return (lam * k + tx, ty - y * k)

AIR = [("Guwahati",91.62,26.13,11,5,"start"),("Bagdogra",88.32,26.68,-11,-8,"end"),
       ("Dibrugarh",95.02,27.48,11,-6,"start"),("Imphal",93.90,24.76,12,15,"start")]
TRAIN = [("Guwahati",91.75,26.16,11,5,"start"),("New Jalpaiguri",88.42,26.68,-11,-8,"end"),
         ("Dimapur",93.73,25.91,11,13,"start"),("Dibrugarh",95.02,27.48,11,-6,"start"),
         ("Agartala",91.28,23.83,-10,12,"end")]
ROAD = [("Guwahati",91.75,26.14,True,11,6,"start"),("Shillong",91.88,25.58,False,0,0,"start"),
        ("Cherrapunjee",91.73,25.30,True,-8,14,"end"),("Tezpur",92.79,26.63,True,8,-6,"start"),
        ("Bomdila",92.40,27.26,False,0,0,"start"),("Tawang",91.86,27.59,True,-6,-10,"end"),
        ("Jorhat",94.22,26.75,True,9,13,"start"),("Pasighat",95.33,28.07,False,0,0,"start"),
        ("Mechuka",94.10,28.61,True,0,-11,"middle")]
ROUTES = [[(91.75,26.14),(91.88,25.58),(91.73,25.30)],
          [(92.79,26.63),(92.40,27.26),(91.86,27.59)],
          [(94.22,26.75),(95.33,28.07),(94.10,28.61)]]
NEIGH = [("BHUTAN",90.1,27.5),("BANGLADESH",89.9,23.9),("CHINA · TIBET",92.4,29.3),("MYANMAR",95.9,23.8)]

W, H = 960, 640
EXT = ((44, 62), (W - 40, H - 34))
fit_pts = [(86.4,20.6),(98.6,29.7)] + [(d[1],d[2]) for d in AIR] + [(d[1],d[2]) for d in TRAIN] + [(d[1],d[2]) for d in ROAD]

# bounds at scale 150, translate (0,0)
p0 = [merc(lo, la, 150, 0, 0) for lo, la in fit_pts]
bx0 = min(p[0] for p in p0); bx1 = max(p[0] for p in p0)
by0 = min(p[1] for p in p0); by1 = max(p[1] for p in p0)
w = EXT[1][0] - EXT[0][0]; h = EXT[1][1] - EXT[0][1]
k = min(w / (bx1 - bx0), h / (by1 - by0))
tx = EXT[0][0] + (w - k * (bx1 + bx0)) / 2
ty = EXT[0][1] + (h - k * (by1 + by0)) / 2
K = 150 * k
print("  scale=%.4f translate=(%.2f, %.2f)" % (K, tx, ty))

P = lambda lon, lat: merc(lon, lat, K, tx, ty)

def to_path(rings, pad=140):
    out = []
    for r in rings:
        pr = [P(lo, la) for lo, la in r]
        xs = [p[0] for p in pr]; ys = [p[1] for p in pr]
        # skip geometry entirely outside the viewBox — keeps the payload small
        if max(xs) < -pad or min(xs) > W + pad or max(ys) < -pad or min(ys) > H + pad:
            continue
        out.append("M" + "L".join("%.1f,%.1f" % p for p in pr) + "Z")
    return "".join(out)

geos = topo["objects"]["countries"]["geometries"]
is_india = lambda g: g.get("properties", {}).get("name") == "India" or str(g.get("id")) == "356"
india_rings, other_rings = [], []
for g in geos:
    (india_rings if is_india(g) else other_rings).extend(rings_of(g))

INDIA = to_path(india_rings)
OTHER = to_path(other_rings)

# topojson.mesh(): each arc once, as an open line
used = set()
for g in geos:
    def walk(a):
        if isinstance(a, int): used.add(a if a >= 0 else ~a)
        else:
            for x in a: walk(x)
    walk(g["arcs"])
mesh = []
for i in sorted(used):
    pr = [P(lo, la) for lo, la in ARCS[i]]
    xs = [p[0] for p in pr]; ys = [p[1] for p in pr]
    if max(xs) < -140 or min(xs) > W + 140 or max(ys) < -140 or min(ys) > H + 140:
        continue
    mesh.append("M" + "L".join("%.1f,%.1f" % p for p in pr))
MESH = "".join(mesh)

def pins(arr, road=False):
    out = []
    for d in arr:
        if road:
            n, lo, la, lab, dx, dy, anc = d
            x, y = P(lo, la)
            out.append('{ n: "%s", x: %.1f, y: %.1f, lab: %s, dx: %d, dy: %d, anchor: "%s" }' % (n, x, y, "true" if lab else "false", dx, dy, anc))
        else:
            n, lo, la, dx, dy, anc = d
            x, y = P(lo, la)
            out.append('{ n: "%s", x: %.1f, y: %.1f, dx: %d, dy: %d, anchor: "%s" }' % (n, x, y, dx, dy, anc))
    return ",\n  ".join(out)

routes = ['"M' + "L".join("%.1f,%.1f" % P(lo, la) for lo, la in r) + '"' for r in ROUTES]
neigh = ",\n  ".join('{ n: "%s", x: %.1f, y: %.1f }' % (n, *P(lo, la)) for n, lo, la in NEIGH)

ts = '''/**
 * Pre-projected map geometry for the Northeast arrival map.
 *
 * The design comp rendered this with d3 + topojson pulled from a CDN, fetching
 * world-atlas at runtime inside an iframe. Since the viewport and projection are
 * both fixed, the projection is resolved once here instead: a Mercator fitted to
 * [[44,62],[920,606]] over the arrival hubs, exactly as the comp's
 * d3.geoMercator().fitExtent() did. Rendering is then plain SVG — no d3, no
 * iframe, no network request, and nothing to fail offline.
 *
 * Regenerated only if the hub list or viewBox changes.
 */

export const MAP_W = %d;
export const MAP_H = %d;

/** India, filled darker than its neighbours. */
export const INDIA_PATH = "%s";

/** Surrounding countries. */
export const OTHER_PATH = "%s";

/** Shared borders, drawn once so coincident edges don't double-stroke. */
export const MESH_PATH = "%s";

export type Pin = { n: string; x: number; y: number; dx: number; dy: number; anchor: string };
export type RoadStop = Pin & { lab: boolean };

export const AIR_PINS: Pin[] = [
  %s,
];

export const TRAIN_PINS: Pin[] = [
  %s,
];

export const ROAD_STOPS: RoadStop[] = [
  %s,
];

/** Dashed road corridors: Guwahati-Cherrapunjee, Tezpur-Tawang, Jorhat-Mechuka. */
export const ROAD_ROUTES: string[] = [
  %s,
];

export const NEIGHBOURS: { n: string; x: number; y: number }[] = [
  %s,
];
''' % (W, H, INDIA, OTHER, MESH, pins(AIR), pins(TRAIN), pins(ROAD, True), ",\n  ".join(routes), neigh)

open("ne-map-data.ts", "w").write(ts)
print("  wrote ne-map-data.ts  %.1f KB" % (len(ts) / 1024))
print("  india path %d chars | other %d | mesh %d" % (len(INDIA), len(OTHER), len(MESH)))
