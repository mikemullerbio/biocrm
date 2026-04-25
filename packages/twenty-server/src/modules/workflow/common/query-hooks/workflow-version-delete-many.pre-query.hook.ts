import { assertIsDefinedOrThrow } from 'twenty-shared/utils';

import { type WorkspacePreQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { type DeleteManyResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';

import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';
import { WorkspaceNotFoundDefaultError } from 'src/engine/core-modules/workspace/workspace.exception';
import { type WorkflowVersionWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-version.workspace-entity';
import { WorkflowVersionValidationWorkspaceService } from 'src/modules/workflow/common/workspace-services/workflow-version-validation.workspace-service';

type WorkflowVersionFilter = {
  id?: { in?: string[]; eq?: string };
};

@WorkspaceQueryHook(`workflowVersion.deleteMany`)
export class WorkflowVersionDeleteManyPreQueryHook
  implements WorkspacePreQueryHookInstance
{
  constructor(
    private readonly workflowVersionValidationWorkspaceService: WorkflowVersionValidationWorkspaceService,
  ) {}

  async execute(
    authContext: WorkspaceAuthContext,
    _objectName: string,
    payload: DeleteManyResolverArgs<WorkflowVersionWorkspaceEntity>,
  ): Promise<DeleteManyResolverArgs<WorkflowVersionWorkspaceEntity>> {
    const { workspace } = authContext;

    assertIsDefinedOrThrow(workspace, WorkspaceNotFoundDefaultError);

    const filter = payload.filter as unknown as WorkflowVersionFilter;
    const ids: string[] = filter?.id?.in ?? (filter?.id?.eq ? [filter.id.eq] : []);

    for (const id of ids) {
      await this.workflowVersionValidationWorkspaceService.validateWorkflowVersionForDeleteOne(
        workspace.id,
        { id },
      );
    }

    return payload;
  }
}
