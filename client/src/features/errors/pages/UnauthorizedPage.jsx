export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-destructive">403</h1>
        <p className="mt-4 text-xl text-muted-foreground">Unauthorized access</p>
      </div>
    </div>
  );
}
