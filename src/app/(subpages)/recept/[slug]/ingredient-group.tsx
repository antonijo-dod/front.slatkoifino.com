export async function IngredientGroup({ groupName, children }: { groupName: string | undefined; children: React.ReactNode }) {
    return (
        <li className="space-y-2">
            <span className="font-medium pb-4">{groupName}</span>
            <ul className="space-y-2">
                {children}
            </ul>
        </li>
    );
}