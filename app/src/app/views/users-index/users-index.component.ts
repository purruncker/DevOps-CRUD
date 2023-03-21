import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { combineLatest, map, Observable, startWith, Subject } from "rxjs";
import { UserEditorDialog } from "src/app/dialogs/user-editor-dialog/user-editor-dialog.component";
import { IUser } from "src/app/entities/user.entity";
import { UserService } from "src/app/services/user.service";

interface UserIndexProps {
    loading?: boolean;
    users?: IUser[];
}

@Component({
    templateUrl: "./users-index.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIndexView {

    public displayedColumns: string[] = ['firstName', 'lastName', 'age'];
    
    constructor(
        private readonly usersService: UserService,
        private readonly dialog: MatDialog
    ) {}

    private readonly $onUpdate: Subject<IUser> = new Subject();

    public $props: Observable<UserIndexProps> = combineLatest([
        this.usersService.findAll(),
        this.$onUpdate.pipe(startWith(null))
    ]).pipe(
        map(([usersRequest, onUpdate]): UserIndexProps => {
            let list: IUser[] = usersRequest.data ?? [];

            if(onUpdate) {
                let wasUpdated = false;
                list = list.map((user) => {
                    if(user.id === onUpdate.id) {
                        wasUpdated = true;
                        return onUpdate;
                    }

                    return user;
                });

                if(!wasUpdated) {
                    list.push(onUpdate);
                }
            }

            return {
                loading: usersRequest.loading,
                users: list
            }
        }),
    );

    public openCreateUserDialog() {
        const dialogRef = this.dialog.open(UserEditorDialog);
        dialogRef.afterClosed().subscribe((result: IUser) => {
            if(typeof result === "object") {
                this.$onUpdate.next(result);
            }
        });
    }

}