"use client";

import { useMemo, useState } from "react";
import { Search, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { LocationRow } from "@/components/locations/location-row";
import { EditLocationModal } from "@/components/locations/edit-location-modal";
import { LocalitySeoModal } from "@/components/locations/LocalitySeoModal";
import { LOCATIONS as INITIAL_LOCATIONS } from "@/data/locations";
import { formatNumber } from "@/lib/utils";

const LEVEL_LABEL = { state: "State", city: "City", locality: "Locality" };

export function LocationTree() {
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [search, setSearch] = useState("");
  const [expandedStates, setExpandedStates] = useState(new Set());
  const [expandedCities, setExpandedCities] = useState(new Set());
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [seoOverrides, setSeoOverrides] = useState({});
  const [seoTarget, setSeoTarget] = useState(null);

  const q = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return locations;
    return locations
      .map((state) => {
        const stateMatches = state.name.toLowerCase().includes(q);
        const cities = state.cities
          .map((city) => {
            const cityMatches = city.name.toLowerCase().includes(q);
            const localities = city.localities.filter(
              (loc) => stateMatches || cityMatches || loc.name.toLowerCase().includes(q)
            );
            if (!stateMatches && !cityMatches && localities.length === 0) return null;
            return { ...city, localities };
          })
          .filter(Boolean);
        if (!stateMatches && cities.length === 0) return null;
        return { ...state, cities };
      })
      .filter(Boolean);
  }, [locations, q]);

  function toggleState(id) {
    setExpandedStates((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCity(id) {
    setExpandedCities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renameNode(target, newName) {
    setLocations((prev) =>
      prev.map((state) => {
        if (state.id !== target.stateId) return state;
        if (target.level === "state") return { ...state, name: newName };
        return {
          ...state,
          cities: state.cities.map((city) => {
            if (city.id !== target.cityId) return city;
            if (target.level === "city") return { ...city, name: newName };
            return {
              ...city,
              localities: city.localities.map((loc) =>
                loc.id === target.localityId ? { ...loc, name: newName } : loc
              ),
            };
          }),
        };
      })
    );
    toast.success(`${LEVEL_LABEL[target.level]} renamed to "${newName}"`);
  }

  function deleteNode(target) {
    setLocations((prev) => {
      if (target.level === "state") return prev.filter((s) => s.id !== target.stateId);
      return prev.map((state) => {
        if (state.id !== target.stateId) return state;
        if (target.level === "city") {
          return { ...state, cities: state.cities.filter((c) => c.id !== target.cityId) };
        }
        return {
          ...state,
          cities: state.cities.map((city) =>
            city.id !== target.cityId
              ? city
              : { ...city, localities: city.localities.filter((l) => l.id !== target.localityId) }
          ),
        };
      });
    });
    toast.success(`"${target.name}" deleted successfully`);
  }

  function saveLocalitySeo(localityId, values) {
    setSeoOverrides((prev) => ({ ...prev, [localityId]: values }));
  }

  const totalCities = locations.reduce((sum, s) => sum + s.cities.length, 0);
  const totalLocalities = locations.reduce(
    (sum, s) => sum + s.cities.reduce((c, city) => c + city.localities.length, 0),
    0
  );
  const totalProperties = locations.reduce((sum, s) => sum + s.propertyCount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="animate-slide-up p-5">
          <p className="text-xs font-medium text-foreground-muted">States</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{locations.length}</p>
        </Card>
        <Card className="animate-slide-up p-5">
          <p className="text-xs font-medium text-foreground-muted">Cities</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{totalCities}</p>
        </Card>
        <Card className="animate-slide-up p-5">
          <p className="text-xs font-medium text-foreground-muted">Localities</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{totalLocalities}</p>
        </Card>
      </div>

      <Card className="animate-slide-up">
        <div className="space-y-2 border-b border-border-subtle p-5">
          <Input
            icon={Search}
            placeholder="Search states, cities, or localities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-sm"
          />
          <p className="text-xs text-foreground-muted">
            {formatNumber(totalProperties)} properties tracked across {locations.length} states
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MapPinned}
            title="No locations found"
            description="Try a different search term."
          />
        ) : (
          <div>
            {filtered.map((state) => {
              const stateExpanded = q ? true : expandedStates.has(state.id);
              return (
                <div key={state.id}>
                  <LocationRow
                    level={0}
                    name={state.name}
                    propertyCount={state.propertyCount}
                    meta={`${state.cities.length} cities`}
                    expanded={stateExpanded}
                    hasChildren={state.cities.length > 0}
                    onToggle={() => toggleState(state.id)}
                    onEdit={() => setEditTarget({ level: "state", stateId: state.id, name: state.name })}
                    onDelete={() => setDeleteTarget({ level: "state", stateId: state.id, name: state.name })}
                  />
                  {stateExpanded &&
                    state.cities.map((city) => {
                      const cityExpanded = q ? true : expandedCities.has(city.id);
                      return (
                        <div key={city.id}>
                          <LocationRow
                            level={1}
                            name={city.name}
                            propertyCount={city.propertyCount}
                            meta={`${city.localities.length} localities`}
                            expanded={cityExpanded}
                            hasChildren={city.localities.length > 0}
                            onToggle={() => toggleCity(city.id)}
                            onEdit={() =>
                              setEditTarget({ level: "city", stateId: state.id, cityId: city.id, name: city.name })
                            }
                            onDelete={() =>
                              setDeleteTarget({ level: "city", stateId: state.id, cityId: city.id, name: city.name })
                            }
                          />
                          {cityExpanded &&
                            city.localities.map((locality) => {
                              const mergedLocality = { ...locality, ...seoOverrides[locality.id] };
                              return (
                                <LocationRow
                                  key={locality.id}
                                  level={2}
                                  name={locality.name}
                                  propertyCount={locality.propertyCount}
                                  expanded={false}
                                  hasChildren={false}
                                  onEdit={() =>
                                    setEditTarget({
                                      level: "locality",
                                      stateId: state.id,
                                      cityId: city.id,
                                      localityId: locality.id,
                                      name: locality.name,
                                    })
                                  }
                                  onEditSeo={() => setSeoTarget(mergedLocality)}
                                  onDelete={() =>
                                    setDeleteTarget({
                                      level: "locality",
                                      stateId: state.id,
                                      cityId: city.id,
                                      localityId: locality.id,
                                      name: locality.name,
                                    })
                                  }
                                />
                              );
                            })}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <EditLocationModal
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        initialName={editTarget?.name}
        levelLabel={editTarget ? LEVEL_LABEL[editTarget.level] : "Location"}
        onSave={(newName) => editTarget && renameNode(editTarget, newName)}
      />

      <LocalitySeoModal
        open={!!seoTarget}
        onOpenChange={(open) => !open && setSeoTarget(null)}
        locality={seoTarget}
        onSave={(values) => seoTarget && saveLocalitySeo(seoTarget.id, values)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete this ${deleteTarget ? LEVEL_LABEL[deleteTarget.level].toLowerCase() : "location"}?`}
        description={
          deleteTarget?.level === "locality"
            ? `"${deleteTarget?.name}" will be permanently removed. This action cannot be undone.`
            : `"${deleteTarget?.name}" and everything under it will be permanently removed. This action cannot be undone.`
        }
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteNode(deleteTarget)}
      />
    </div>
  );
}
