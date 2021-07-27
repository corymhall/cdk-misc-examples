# Custom CDK Bootstrap

This project is an example of how you can use the CDK to manage customizing the CDK bootstrap template.

To illustrate this, I am updating the IAM roles to also require an external-id to be passed with the AssumeRole
call. I also add an additional IAM role.


## Step 1: Generate Template

First generate the default template and save it to a templates folder.

```bash
$ CDK_NEW_BOOTSTRAP=1 cdk bootstrap --show-template > templates/bootstrap-template.yml
```

## Step 2: Customize the template

Now you can import the template into the CDK app using the [cloudformation-include](https://docs.aws.amazon.com/cdk/api/latest/docs/cloudformation-include-readme.html)
construct.

See [bin/example2.ts](./bin/example2.ts)

## Step 3: Synthesize the new template

```bash
$ npm run build
$ cdk synth
```

This will synthesize your new template to `cdk.out/CDKToolkit.template.json`.

## Step 4 (Optional): Check the diff

If you have already bootstrapped the account and are making changes then you can run `cdk diff` to view the changes you are making.

```bash
$ cdk diff
```

## Step 5: Bootstrap using the new template

```bash
$ cdk bootstrap aws://ACCOUNT_ID/REGION --template cdk.out/CDKToolkit.template.json
```
