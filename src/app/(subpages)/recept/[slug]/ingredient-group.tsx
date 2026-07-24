export function IngredientGroup({ groupName, children }: { groupName: string | undefined; children: React.ReactNode }) {
    return (
        <li className="space-y-3 [&:not(:first-child)]:mt-6 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line [&:not(:first-child)]:pt-6">
            {groupName && (
                <span className="block font-[family-name:var(--font-fraunces)] text-lg text-ink">
                    {groupName}
                </span>
            )}
            <ul className="space-y-2.5">
                {children}
            </ul>
        </li>
    );
}