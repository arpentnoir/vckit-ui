import { useShow } from "@pankod/refine-core";
import { Show, Typography, Stack, MarkdownField } from "@pankod/refine-mui";

export const CredentialShow = () => {
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <MarkdownField value={` \`\`\`json \n ${JSON.stringify(record?.verifiableCredential, null, 2)}} \n \`\`\``} />
            </Stack>
        </Show>
    );
};
