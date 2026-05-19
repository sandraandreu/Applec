import { describe, it, expect } from "vitest";
import { computePermissions } from "../user.model";

describe("computePermissions", () => {
  it("admin tiene todos los permisos de gestión", () => {
    expect(computePermissions("admin")).toEqual({
      canCreateEvents: true,
      canDeleteEvents: true,
      canEditOwnEvents: false,
      canEditAllEvents: true,
      canManageMembers: true,
      canSeeAttendees: true,
      canSeeDetailedFilters: true,
      canViewMemberEmail: true,
      canInviteMembers: true,
    });
  });

  it("organizer puede crear y editar sus eventos pero no gestionar miembros", () => {
    expect(computePermissions("organizer")).toEqual({
      canCreateEvents: true,
      canDeleteEvents: true,
      canEditOwnEvents: true,
      canEditAllEvents: false,
      canManageMembers: false,
      canSeeAttendees: true,
      canSeeDetailedFilters: true,
      canViewMemberEmail: true,
      canInviteMembers: true,
    });
  });

  it("member no tiene ningún permiso de gestión", () => {
    expect(computePermissions("member")).toEqual({
      canCreateEvents: false,
      canDeleteEvents: false,
      canEditOwnEvents: false,
      canEditAllEvents: false,
      canManageMembers: false,
      canSeeAttendees: false,
      canSeeDetailedFilters: false,
      canViewMemberEmail: false,
      canInviteMembers: false,
    });
  });

  it("sin rol no tiene ningún permiso", () => {
    expect(computePermissions(undefined)).toEqual({
      canCreateEvents: false,
      canDeleteEvents: false,
      canEditOwnEvents: false,
      canEditAllEvents: false,
      canManageMembers: false,
      canSeeAttendees: false,
      canSeeDetailedFilters: false,
      canViewMemberEmail: false,
      canInviteMembers: false,
    });
  });
});
