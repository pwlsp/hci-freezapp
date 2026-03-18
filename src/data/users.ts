export const USERS = [
    { id: "u1", name: "Alice" },
    { id: "u2", name: "Bob" },
    { id: "u3", name: "Carol" },
];

export function getUserName(id?: string) {
    if (!id) return "";
    const u = USERS.find((x) => x.id === id);
    return u ? u.name : id;
}
